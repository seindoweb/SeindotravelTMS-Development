<?php

namespace App\Notifications;

use App\Constants\SystemConstant;
use App\Mail\OtpForgotPasswordMail;
use App\Mail\PasswordChangedMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordActivityNotification extends Notification
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
     * type
     *
     * @var mixed
     */
    public $type;


    /**
     * __construct
     *
     * @param mixed $offerData
     * @param mixed $type
     * @param mixed $platform
     * @return void
     */
    public function __construct($offerData, $type = null, $platform = null)
    {
        $this->offerData    = $offerData;
        $this->type         = $type;
        $this->platform     = $platform;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable)
    {
        if (in_array($this->type, [SystemConstant::PASSWORD_TYPE_ACTIVITY_REQ_OTP])) {
            return ['mail'];
        } else if (in_array($this->type, [SystemConstant::PASSWORD_TYPE_ACTIVITY_PASS_CHA])) {
            return ['mail', 'database'];
        }
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        if (in_array($this->type, [SystemConstant::PASSWORD_TYPE_ACTIVITY_REQ_OTP])) {
            return (new OtpForgotPasswordMail($this->offerData))->to($notifiable->email);
        } else if (in_array($this->type, [SystemConstant::PASSWORD_TYPE_ACTIVITY_PASS_CHA])) {
            return (new PasswordChangedMail($this->offerData))->to($notifiable->email);
        }
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
