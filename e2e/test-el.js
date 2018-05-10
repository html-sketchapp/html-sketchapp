class TestEl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    console.log('test-el constructed');
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Optimist, Arial, sans-serif;
        }
        button {
          background: #53cf92;
          border-radius: 4px;
          color: white;
          font-family: Optimist, Arial, sans-serif;
          font-size: 16px;
          padding: 10px;
        }
      </style>
      <h1>My custom button</h1>
      <button>Shadow content -> <slot></slot></button>
    `;
  }
}

customElements.define('test-el', TestEl);
