import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { BcryptModule } from 'src/bcrypt/bcrypt.module'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.stratagy'
import { LocalStrategy } from './local.strategy'
// import { FolderModule } from 'src/folder/folder.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtAuthGuard, LocalAuthGuard } from './auth.guard'
import { RequestScopedModule } from 'src/request-scoped/request-scoped.module'
import { FolderModule } from 'src/folder/folder.module'
@Module({
  imports: [
    UserModule,
    BcryptModule,
    FolderModule,
    RequestScopedModule,
    PassportModule.register({ defaultStrategy: ['jwt', 'local'] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'), // 加密密钥
          signOptions: { expiresIn: configService.get('jwt.expiresIn') } // 配置： 保存时间
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, LocalAuthGuard, JwtAuthGuard]
})
export class AuthModule {}
