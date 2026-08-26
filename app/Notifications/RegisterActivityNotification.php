<?php

namespace App\Notifications;

use App\Mail\EmailVerificationMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RegisterActivityNotification extends Notification
{
    use Queueable;

    /**
     * platform
     *
     * @var mixed
     */
    public $platform;
    /**
     * offerData
     *
     * @var mixed
     */
    public $offerData;

    /**
     * Create a new notification instance.
     * @param mixed $offerData
     */
    public function __construct($offerData, $platform = null)
    {
        $this->offerData  = $offerData;
        $this->platform = $platform;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        return (new EmailVerificationMail($this->offerData))->to($notifiable->email);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            $this->offerData,
        ];
    }
}
