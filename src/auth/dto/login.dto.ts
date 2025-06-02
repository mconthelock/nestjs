// src/auth/dto/login.dto.ts
export class LoginDto {
  // @IsNotEmpty({ message: 'ชื่อผู้ใช้ห้ามว่าง' })
  // @IsString()
  username!: string; // หรือ email
  // @IsNotEmpty({ message: 'รหัสผ่านห้ามว่าง' })
  // @IsString()
  password!: string;
}
