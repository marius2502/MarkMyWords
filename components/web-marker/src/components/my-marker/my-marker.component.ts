import uuidv4 from 'uuid/v4';
import { MarkerService } from './../../services/marker.service';
import { Mark } from './../../models/mark';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { highlightText } from '../../helper/markerHelper';
import { styleMap } from 'lit-html/directives/style-map';
const componentCSS = require('./my-marker.component.scss');

@customElement('my-marker')
export class MyMarkerElement extends LitElement {
  static styles = css`${unsafeCSS(componentCSS)}`;

  @property()
  marks!: Mark[];

  @property()
  id!: string;

  @property()
  left = '0px';

  @property()
  show = false;

  private markerService = new MarkerService();

  async firstUpdated() {
    const rectLines = this.parentElement.getClientRects() as DOMRectList;
    //this.left = rectLines.length > 1 ? this.left = '50%' : this.left = `${rectLines[0].left - this.parentElement.offsetLeft}px`;
    console.log("LEft: " + this.left);
    console.log(`rectLines[0].left: ${rectLines[0].left}`);
    console.log(`this.parentElement.offsetLeft: ${this.parentElement.offsetLeft}`);
    console.log(this.id);
  }

  loadedEvent() {
    this.dispatchEvent(
      new CustomEvent('loaded', {
        bubbles: true,
        detail: this.marks
      })
    );
  }

  async emit(e: MouseEvent) {
    e.stopPropagation();
    this.show = false;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const mark: Mark = {
      id: uuidv4(),
      url: location.href,
      origin: location.href,
      text: selection.toString(),
      anchorNodeText: selection.anchorNode['data'],
      anchorOffset: selection.anchorOffset,
      createdAt: new Date().getTime(),
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      nodeData: range.startContainer.nodeValue,
      nodeHTML: range.startContainer.parentElement.innerHTML,
      completeText: range.startContainer.parentElement.textContent,
      nodeTagName: range.startContainer.parentElement.tagName.toLowerCase(),
      startContainer: range.startContainer,
      endContainer: range.endContainer,
      startContainerText: range.startContainer.textContent,
      endContainerText: range.endContainer.textContent
    };

    highlightText(null, mark);
    window.getSelection().empty();

    await this.markerService.createMark(mark);
    // this.dispatchEvent(
    //   new CustomEvent('clicked', {
    //     bubbles: true,
    //     detail: mark
    //   })
    // );
  }

  render() {
    return html`
    ${this.show ? html`
    <div class="markContainer">

      <my-menu .left=${this.left}></my-menu>

  </div>
    ` : ''}
 `;
  }

}
