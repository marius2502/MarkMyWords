import { MarkerService } from './../../services/marker.service';
import { Mark } from './../../models/mark';
import { css, customElement, html, LitElement, property, unsafeCSS, query } from 'lit-element';
const componentCSS = require('./my-marker.component.scss');

@customElement('my-marker')
export class MyMarkerElement extends LitElement {
  static styles = css`${unsafeCSS(componentCSS)}`;

  listener = [];

  @property()
  editTags = false;

  @property()
  menuWidth!: number;

  @property()
  markId!: string;

  @property()
  tags = ['Test'];

  @property()
  show = false;

  @property()
  animation: 'slideIn' | 'slideOut' = 'slideIn';

  /**
   *  Necessary to abort hide animation when user enters mark again
   *
   * @memberof MyMarkerElement
   */
  abortHide = false;

  async firstUpdated() {

    if (this.markId) {
      this.setPosition();
      this.registerListener();
    }
  }

  /**
   *  Sets position of this component so that it is centralized above mark-element
   *
   * @memberof MyMarkerElement
   */
  setPosition() {
    console.log(this.id);
    const rectLines = this.parentElement.getClientRects() as DOMRectList;
    this.style.left = rectLines.length === 1 ? this.parentElement.offsetLeft + 'px' : this.parentElement.parentElement.offsetLeft + 'px';
    this.style.width = this.parentElement.offsetWidth + 'px';
    const offsetTop = rectLines.length === 1 ? 0 : (rectLines.length - 1) * rectLines[0].height;
    this.style.transform = `translateY(${-offsetTop}px)`;
    this.classList.add('slideIn');
  }

  /**
   *  Register Listener to show and hide hovering menu.
   *  Abortes hiding when user enters element again after 300ms
   *
   * @memberof MyMarkerElement
   */
  registerListener() {
    this.parentElement.addEventListener('mouseenter', (e) => {
      this.show = true;
      this.abortHide = true;
      this.animation = 'slideIn';
    });

    this.parentElement.addEventListener('mouseleave', () => {
      this.abortHide = false;
      setTimeout(() => {
        if (!this.abortHide && !this.editTags) {
          this.animation = 'slideOut';
        }
      }, 300);
    });
  }

  /**
   *  Cascading event to trigger delete in root component
   *
   * @memberof MyMarkerElement
   */
  emitDeleted() {
    this.dispatchEvent(
      new CustomEvent('deleted', {
        bubbles: true,
        detail: this.markId
      })
    );
  }

  updateTags() {
    this.editTags = false;
    console.log('TODO: Update in Server.')
  }

  render() {
    return html`
    ${this.show ? html`
    ${this.editTags ? html`
    <div class="chip-container">
      <bronco-chip-list
      @tagsChanged=${(e: CustomEvent) => this.tags = e.detail}
      @submitTriggered=${() => this.updateTags()}
      @blur=${(e) => console.log(e)}
      .focused=${this.editTags}
      .chips=${this.tags}
      ></bronco-chip-list>
    </div>
    ` : ''}
    <div class="markContainer">
      <my-menu .menuWidth=${this.menuWidth} class="${this.animation}"
      @deleted=${() => this.emitDeleted()}
      @editTags=${() => this.editTags ? this.updateTags() : this.editTags = true}
      .editTags=${this.editTags}
      .markId=${this.markId}></my-menu>
    </div>

    ` : ''}
 `;
  }


}
