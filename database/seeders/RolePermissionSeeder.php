<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Permissions
        $permissions = [
            'view',
            'create',
            'edit',
            'delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Roles
        $roles = [
            'super-admin',
            'executive',
            'admin',
            'reservation',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role,
                'guard_name' => 'web',
            ]);
        }

        // Super Admin
        Role::findByName('super-admin')
            ->syncPermissions($permissions);

        // Executive
        Role::findByName('executive')
            ->syncPermissions([
                'view',
            ]);

        // Admin
        Role::findByName('admin')
            ->syncPermissions($permissions);

        // Reservation
        Role::findByName('reservation')
            ->syncPermissions([
                'view',
                'create',
                'edit',
            ]);


        $users = [
            'it.seindo@gmail.com' => 'super-admin',
        ];

        foreach ($users as $email => $role) {
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->syncRoles($role);
            }
        }
    }
}
