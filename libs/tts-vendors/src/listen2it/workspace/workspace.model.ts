import {
  l2i_Workspace,
  WorkspaceMaxCharacterOption,
} from '@app/tts-vendors/listen2it/admin/admin.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type WorkspaceDocument = HydratedDocument<Workspace>;

@Schema({
  autoCreate: true,
  collection: 'l2i_workspaces',
})
export class Workspace {
  @Prop({ required: true, index: true })
  workspaceID: string;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ type: 'Number' })
  maxCharacters: WorkspaceMaxCharacterOption;

  @Prop()
  usage: number;

  @Prop({ required: true, index: true })
  accountID: number;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);

@Injectable()
export class WorkspaceModel {
  constructor(
    @InjectModel(Workspace.name, 'LISTEN2IT_LOCAL_CACHE')
    private readonly document: Model<Workspace>,
  ) {
    this.document.ensureIndexes();
  }

  async save(workspace: l2i_Workspace) {
    let doc = (await this.document.findOne({
      workspaceID: workspace.id,
    })) as Workspace;
    if (!doc) {
      doc = new Workspace();
    }

    doc.workspaceID = workspace.id;
    doc.apiKey = workspace.api_key;
    doc.accountID = Math.floor(workspace.account_id);
    doc.maxCharacters = workspace.max_characters;
    doc.usage = workspace.usage.characters_used;
    doc.createdAt = workspace.created_at;
    doc.updatedAt =
      workspace.usage.updated_at > workspace.updated_at
        ? workspace.usage.updated_at
        : workspace.updated_at;

    // @ts-ignore
    if (doc._id) {
      return this.document.updateOne({ workspaceID: workspace.id }, doc);
    }
    return this.document.create(doc);
  }

  async findByAccountID(accountID: number) {
    return this.document.findOne({ accountID });
  }

  async deleteById(workspaceID: string) {
    const result = await this.document.deleteOne({ workspaceID });
    return !!result;
  }
}
