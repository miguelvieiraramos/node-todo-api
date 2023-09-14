import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

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

@Entity()
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    title: string;

    @Column({
        length: 255,
        nullable: true,
    })
    description: string;

    @Column({
        default: false
    })
    isDone: boolean;

    @ManyToOne(() => User)
    user: User;
}
