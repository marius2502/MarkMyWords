import { Entity } from './entity';
export interface Mark extends Entity{
  url: string,
  origin: string,
  text: string
  anchorNodeText: string,
  anchorOffset: number,
  createdAt: number,
  nodeTagName: string,
  nodeHTML: string,
  startOffset: number,
  endOffset: number,
  nodeData: string,
  startContainer: Node,
  endContainer: Node,
  startContainerText: string,
  endContainerText: string,
  completeText: string
}