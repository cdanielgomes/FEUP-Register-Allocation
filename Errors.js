class Error {

    constructor(container) {
        this.container = container
        this.message = []
    }



    clean() {
        this.message = []
    }

    print() {
        
        let message = ""

        this.message.forEach(elem => {
            if (elem.register) {
                message += '<div class="input-color"> <div class="color-box" style="background-color:' + colorsPallete[elem.register] + ';" ></div>'
                message += "<div class='texting'> " + elem.msg + "</div></div> "
            } else {

                if (elem.error) {

                    message += "<div class='.text-danger texting'> " + elem.msg + "</div>"

                }
            message += "<div class='texting'> " + elem.msg + "</div> "

            }



        })
        
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