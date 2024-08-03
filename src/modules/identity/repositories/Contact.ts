import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type LinkPrecedence = "primary" | "secondary";

@Entity({ name: "contacts" })
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: true })
  phoneNumber?: string;

  @Column({ type: "varchar", nullable: true })
  email?: string;

  @Column({ type: "int", nullable: true })
  linkedId?: number;

  @Column({ type: "varchar" })
  linkPrecendence!: LinkPrecedence;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt?: Date;

  constructor(
    phoneNumber?: string,
    email?: string,
    linkedId?: number,
    linkPrecedence?: LinkPrecedence
  ) {
    if (phoneNumber) this.phoneNumber = phoneNumber;
    if (email) this.email = email;
    if (linkedId) this.linkedId = linkedId;
    if (linkPrecedence) this.linkPrecendence = linkPrecedence;
  }
}
