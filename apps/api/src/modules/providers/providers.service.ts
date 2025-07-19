import { Injectable, NotFoundException } from '@nestjs/common';
import { Provider } from '../shared/entities/providers.entity';
import { CreateProviderProfileDto } from './validation/create-provider-profile.validation';
import { UpdateProviderProfileDto } from './validation/update-provider-profile.validation';
import { UserRepository } from '../shared/repositories/user.repository';
import { ProviderRepository } from '../shared/repositories/provider.repository';

@Injectable()
export class ProvidersService {
  constructor(
    private readonly providersRepository: ProviderRepository,
    private readonly usersRepository: UserRepository
  ) {}

  async createProfile(createProfileDto: CreateProviderProfileDto, userId: number): Promise<Provider> {
    // Check if user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if provider profile already exists
    let provider = await this.providersRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['user']
    });

    if (provider) {
      // Update existing profile
      provider.bio = createProfileDto.bio || provider.bio;
      provider.specialization = createProfileDto.specialization || provider.specialization;
      provider.experience = createProfileDto.experience || provider.experience;
      provider.profileImage = createProfileDto.profileImage || provider.profileImage;
    } else {
      // Create new profile
      provider = this.providersRepository.create({
        ...createProfileDto,
        user,
      });
    }

    return this.providersRepository.save(provider);
  }

  async updateProfile(updateProfileDto: UpdateProviderProfileDto, userId: number): Promise<Provider> {
    const provider = await this.providersRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['user']
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    // Update fields if provided
    if (updateProfileDto.bio !== undefined) {
      provider.bio = updateProfileDto.bio;
    }
    if (updateProfileDto.specialization !== undefined) {
      provider.specialization = updateProfileDto.specialization;
    }
    if (updateProfileDto.experience !== undefined) {
      provider.experience = updateProfileDto.experience;
    }
    if (updateProfileDto.profileImage !== undefined) {
      provider.profileImage = updateProfileDto.profileImage;
    }

    return this.providersRepository.save(provider);
  }

  async getProfile(userId: number): Promise<Provider> {
    const provider = await this.providersRepository.findOne({ 
      where: { user: { id: userId } },
      relations: ['user']
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return provider;
  }

  async findAll(): Promise<Provider[]> {
    return this.providersRepository.find({
      relations: ['user']
    });
  }

  async findOne(id: number): Promise<Provider> {
    const provider = await this.providersRepository.findOne({ 
      where: { id },
      relations: ['user']
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }
}
