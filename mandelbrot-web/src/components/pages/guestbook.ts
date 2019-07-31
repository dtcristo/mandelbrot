import { html, customElement, property } from "lit-element";
import { firestore } from "../../firebase";
import orderBy from "lodash-es/orderBy";

import BaseComponent from "../base_component";

@customElement("x-guestbook")
export default class Guestbook extends BaseComponent {
  @property({ type: String }) name = "";
  @property({ type: String }) messageText = "";
  @property({ type: Array }) messages: Array<any> = [];
  @property({ type: Boolean }) isLoading = true;

  unsubscribe!: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.unsubscribe = firestore
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(20)
      .onSnapshot(snapshot => {
        for (const change of snapshot.docChanges()) {
          if (change.type === "removed") {
            console.log("removed", change.doc.id);
            const index = this.messages.findIndex(
              message => message.id === change.doc.id
            );
            if (index > -1) {
              this.messages.splice(index, 1);
            }
          } else {
            console.log("added", change.doc.id);
            this.messages.push(change.doc);
          }
        }
        this.isLoading = false;
        this.requestUpdate();
      });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe();
  }

  onNameInput(event: any) {
    this.name = event.target.value;
  }

  onMessageInput(event: any) {
    this.messageText = event.target.value;
  }

  async onMessagePost(event: any) {
    event.preventDefault();
    const newMessage = this.messageText;
    this.messageText = "";
    try {
      const docRef = await firestore.collection("messages").add({
        name: this.name === "" ? null : this.name,
        text: newMessage,
        timestamp: Date.now()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async onMessageDelete(_event: any) {
    console.log("delete");
  }

  render() {
    console.log("render");
    return html`
      <section class="section">
        <div class="container">
          <div class="content">
            <h1>Guestbook</h1>
            <p>
              Type a short message for the whole world to see.
            </p>

            <div class="columns">
              <div class="column is-two-thirds-tablet is-half-desktop">
                <form>
                  <div class="field is-horizontal">
                    <div class="field-label is-normal">
                      <label class="label">Name</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <p class="control">
                          <input
                            class="input"
                            type="text"
                            placeholder="Enter your name"
                            maxlength="30"
                            @input=${this.onNameInput}
                            .value=${this.name}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="field is-horizontal">
                    <div class="field-label is-normal">
                      <label class="label">Message</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <p class="control">
                          <textarea
                            class="textarea"
                            placeholder="Enter your message"
                            maxlength="200"
                            @input=${this.onMessageInput}
                            .value=${this.messageText}
                          ></textarea>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="field is-grouped is-grouped-right">
                    <div class="control">
                      <button
                        class="button is-info"
                        type="submit"
                        @click=${this.onMessagePost}
                        ?disabled=${this.messageText === ""}
                      >
                        Post message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <hr />
            <h2>Visitor messages</h2>

            ${this.isLoading
              ? html`
                  <p>Loading...</p>
                `
              : this.messages.length > 0
              ? html`
                  <ul>
                    ${orderBy(
                      this.messages,
                      m => m.data().timestamp,
                      "desc"
                    ).map((message: any) => {
                      const { name, text, timestamp } = message.data();
                      const localeString = new Date(timestamp).toLocaleString();
                      return html`
                        <li>
                          <em>${localeString}</em> -
                          <strong>${name ? name : "Anonymous"}</strong> -
                          <span>${text}</span>
                        </li>
                      `;
                    })}
                  </ul>
                `
              : html`
                  <p>No messages yet.</p>
                `}
          </div>
        </div>
      </section>
    `;
  }
}
