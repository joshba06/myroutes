// src/controllers/sortable_controller.js

import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"
import Rails from 'rails-ujs'

export default class extends Controller {

  static targets = ["results"]

  connect() {
    console.log("Sortable controller is connected!")
    this.sortable = Sortable.create(this.resultsTarget, {
      animation: 150,
      ghostClass: 'blue-background-class',
      onEnd: this.end.bind(this)
      // onEnd: (event) => {
      //   alert(`${event.oldIndex} moved to ${event.newIndex}`)
      // }
    });
  }

  end(event) {
    let id = event.item.dataset.id
    console.log(id)

    let data = new FormData()
    data.append("position", event.newIndex + 1)

    console.log(event)

    console.log(data)
    let formAction = this.data.get("url").replace(":id", id)
    console.log(formAction)

    fetch(formAction, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': Rails.csrfToken()
      },
      body: data
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data)
      })

    // Rails.ajax({
    //   url: this.data.get("url").replace(":id", id),
    //   type: 'PATCH',
    //   data: data
    // })
  }
}
