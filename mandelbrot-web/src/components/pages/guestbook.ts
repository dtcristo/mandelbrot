import { html, customElement, property } from "lit-element";
import { firestore } from "../../firebase";
import orderBy from "lodash-es/orderBy";

import BaseComponent from "../base_component";

interface Document<T> extends firebase.firestore.QueryDocumentSnapshot {
  data(): T;
}

interface Message {
  name: string;
  text: string;
  timestamp: number;
}

@customElement("x-guestbook")
export default class Guestbook extends BaseComponent {
  @property() name = "";
  @property() messageText = "";
  @property() messages: Document<Message>[] = [];
  @property() isLoading = true;

  queryData(): () => void {
    return firestore
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(20)
      .onSnapshot(snapshot => {
        for (const change of snapshot.docChanges()) {
          if (change.type === "removed" || change.type === "modified") {
            const index = this.messages.findIndex(m => m.id === change.doc.id);
            if (index > -1) {
              this.messages.splice(index, 1);
            }
          }
          if (change.type === "added" || change.type === "modified") {
            this.messages.push(change.doc as Document<Message>);
          }
        }
        this.isLoading = false;
        this.requestUpdate();
      });
  }

  queryUnsubscribe!: () => void;

  connectedCallback() {
    super.connectedCallback();
    this.queryUnsubscribe = this.queryData();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.queryUnsubscribe();
  }

  onNameInput(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
  }

  onMessageInput(event: Event) {
    this.messageText = (event.target as HTMLTextAreaElement).value;
  }

  onMessagePost(event: any) {
    event.preventDefault();
    const newMessageText = this.messageText;
    this.messageText = "";
    firestore.collection("messages").add({
      name: this.name === "" ? null : this.name,
      text: newMessageText,
      timestamp: Date.now()
    });
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
                    ).map(message => {
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
