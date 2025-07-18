import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/shared/entities/roles.entity';
import { RoleRepository } from 'src/modules/shared/repositories/role.repository';

export class RoleSeeder implements Seeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: RoleRepository,
  ) {}

  async seed(): Promise<any> {
    const rolesData = [
      {
        name: 'Provider',
        description: 'Provider',
      },
      {
        name: 'User',
        description: 'User',
      },
    ];
    await this.roleRepository.createQueryBuilder()
      .insert()
      .into(Role)
      .values(rolesData)
      .orIgnore() 
      .execute();
    console.log('Role seeding completed!');
  }

  async drop(): Promise<any> {
    return this.roleRepository.delete({});
  }
}
