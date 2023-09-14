import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        length: 15,
        unique: true,
    })
    username: string;
    
    @Column({
        length: 95,
    })
    password: string;
}
