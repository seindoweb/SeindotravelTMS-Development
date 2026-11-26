<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpForgotPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * offerData
     *
     * @var mixed
     */
    private $offerData;

    /**
     * __construct
     *
     * @param mixed $offerData
     * @return void
     */
    public function __construct($offerData)
    {
        $this->offerData = $offerData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Seindo Travel – Otp Forgot Password',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.html.otp-forgot-password',
            with: [
                'title' => 'Your Password Reset Code',
                'description' => 'We received a request to reset the password for your account. Enter the verification code below on the password reset screen to continue:',
                'code' => $this->offerData['code'],
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
