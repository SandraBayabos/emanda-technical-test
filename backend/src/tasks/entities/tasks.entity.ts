import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  // Added onDelete cascade so that if a parent task is deleted, its subtasks are also deleted
  @ManyToOne(() => Task, (task) => task.subtasks, { nullable: true, onDelete: 'CASCADE' })
  parent?: Task;

  // New column to link a subtask to its parentId
  @Column({ nullable: true })
  parentId?: number;

  @OneToMany(() => Task, (task) => task.parent)
  subtasks!: Task[];
}
