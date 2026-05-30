<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        Http::fake(['api.dicebear.com/*' => Http::response('<svg></svg>', 200)]);

        $response = $this->withoutVite()->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        Http::fake([
            'api.dicebear.com/*' => Http::response('<svg></svg>', 200),
            'ip-api.com/*'       => Http::response(['status' => 'fail'], 200),
        ]);

        $response = $this->post('/register', [
            'firstname' => 'Test',
            'lastname' => 'User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('verification.notice', absolute: false));
    }

    public function test_registration_sets_timezone_from_ip(): void
    {
        Http::fake([
            'api.dicebear.com/*' => Http::response('<svg></svg>', 200),
            'ip-api.com/*'       => Http::response([
                'status'      => 'success',
                'countryCode' => 'GB',
                'timezone'    => 'Europe/London',
            ], 200),
        ]);

        $this->withServerVariables(['REMOTE_ADDR' => '81.2.69.142'])->post('/register', [
            'firstname'             => 'Jane',
            'lastname'              => 'Doe',
            'email'                 => 'jane@example.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::where('email', 'jane@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('Europe/London', $user->getMeta('timezone'));
    }

    public function test_registration_sets_gallery_currency_from_ip(): void
    {
        Http::fake([
            'api.dicebear.com/*' => Http::response('<svg></svg>', 200),
            'ip-api.com/*'       => Http::response([
                'status'      => 'success',
                'countryCode' => 'GB',
                'timezone'    => 'Europe/London',
            ], 200),
        ]);

        $this->withServerVariables(['REMOTE_ADDR' => '81.2.69.142'])->post('/register', [
            'firstname'             => 'Jane',
            'lastname'              => 'Doe',
            'email'                 => 'jane@example.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::where('email', 'jane@example.com')->first();
        $this->assertNotNull($user);

        $gallery = $user->galleriesOwned()->first();
        $this->assertNotNull($gallery);
        $this->assertEquals('GBP', $gallery->getMeta('currency'));
    }

    public function test_registration_falls_back_to_default_when_ip_unresolvable(): void
    {
        Http::fake([
            'api.dicebear.com/*' => Http::response('<svg></svg>', 200),
            'ip-api.com/*'       => Http::response(['status' => 'fail'], 200),
        ]);

        $this->post('/register', [
            'firstname'             => 'John',
            'lastname'              => 'Smith',
            'email'                 => 'john@example.com',
            'password'              => 'password',
            'password_confirmation' => 'password',
        ]);

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user);
        $this->assertNull($user->getMeta('timezone'));

        $gallery = $user->galleriesOwned()->first();
        $this->assertNotNull($gallery);
        $this->assertNull($gallery->getMeta('currency'));
    }
}
