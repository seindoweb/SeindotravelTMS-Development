<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('WebMobile.WS.User.Notification.{token}', function (User $user, string $token) {

    return (string) $user->push_token === (string) $token;
});
