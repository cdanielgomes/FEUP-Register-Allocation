class Error {

    constructor(container) {
        this.container = container
        this.message = []
    }



    clean() {
        this.message = []
    }

    print() {
        console.log(this.message)
        let message = ""

        this.message.forEach(elem => {
            if (elem.register) {
                message += '<div class="input-color"> <div class="color-box" style="background-color:' + colorsPallete[elem.register] + ';" ></div>'
                message += "<div class='texting'> " + elem.msg + "</div></div>  <br>"
            } else {

                if (elem.error) {

                    message += "<div class='.text-danger texting'> " + elem.msg + "</div>"

                }
            message += "<div class='texting'> " + elem.msg + "</div> "

            }



        })
        console.log(message)
        this.container.innerHTML = message
    }

    addMessage(message) {

        message.forEach(elem => {
            this.message.push(elem)
        })
    }

    setContainer(container) {
        this.container = container
    }


    printError() {


    }

    addAndPrint(...message) {
        this.clean()
        this.addMessage(message)
        this.print()
    }

}