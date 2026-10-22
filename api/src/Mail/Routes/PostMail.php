<?php

namespace App\Mail\Routes;

use Neoan\Routing\Attributes\Post;
use Neoan\Routing\Interfaces\Routable;

#[Post('/api/mail')]
class PostMail implements Routable
{
    public function __invoke(): array
    {
        return ['name' => 'PostMail'];
    }
}