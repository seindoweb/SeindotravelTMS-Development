<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>@yield('title')</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="antialiased text-black bg-white">
    <section>
        <div class="relative w-full min-h-screen bg-no-repeat bg-cover bg-pattern-lines">
            <div class="grid min-h-screen px-8">
                <div class="container relative z-10 grid mx-auto my-auto text-center place-items-center">
                    <h1
                        class="block font-sans text-4xl font-semibold !leading-snug tracking-normal text-blue-gray-900 antialiased lg:text-5xl">
                        Error @yield('code')
                    </h1>
                    <h1
                        class="mt-6 block font-sans text-4xl font-semibold !leading-snug tracking-normal text-blue-gray-900 antialiased lg:text-3xl">
                        @yield('message')
                    </h1>

                </div>
            </div>
        </div>
    </section>
</body>

</html>
