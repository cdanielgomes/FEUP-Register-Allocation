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
            message += "<span> " + elem + "</span> <br>"
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


    addAndPrint(...message) {
        this.clean()
        this.addMessage(message)
        this.print()
    }

}