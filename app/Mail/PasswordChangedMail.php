<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordChangedMail extends Mailable
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
            subject: 'Seindo Travel – Password Changed Successfully',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $user = User::query()->where('email', $this->offerData['email'])->first();
        return new Content(
            view: 'emails.html.password-changed',
            with: [
                'title' => 'Your account password has been updated.',
                'description' => 'Hi ' . ($user?->full_name ?? 'there') . ',',
                'email' => $user?->email ?? $this->offerData['email'],
                'name' => $user?->full_name ?? "n/a"
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
