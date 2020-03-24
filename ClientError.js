const ApolloError = require("apollo-client");


const MESSAGE_GENERIC_ERROR = "Problemas con la aplicación. Contactese con el administrador"
const MESSAGE_NETWORK_ERROR = "Problemas con el servidor. Contactese con el administrador.";
const MESSAGE_VALIDATION = "Problemas de validación. Revise los datos ingresados";
const MESSAGE_FORBIDEN = "No Autorizado"
const MESSAGE_UNAUTHENTICATED = "Requiere login"

module.exports = class ClientError extends Error {
    constructor(error) {
        super(error.message);
        this.name = "ClientError";
        this.inputErrors = {}
        this.showMessage = ""

        if (error instanceof ApolloError) {

            if (error.networkError) {
                this.showMessage = MESSAGE_NETWORK_ERROR
            } else if (error.graphQLErrors.length > 0) {

                this.processFrapjQLErrors(error.graphQLErrors)
            }

        } else {
            this.showMessage = MESSAGE_GENERIC_ERROR
        }
    }

    processFrapjQLErrors(graphQLErrors) {

        graphQLErrors.forEach(gqlError => {
            if (gqlError.extensions.code == "BAD_USER_INPUT") {
                this.showMessage = MESSAGE_VALIDATION
                this.inputErrors = {...this.inputErrors, ...gqlError.extensions.exception.inputErrors}
            }
            if (gqlError.extensions.code == "FORBIDDEN") {
                this.showMessage = MESSAGE_FORBIDEN
            }

            if (gqlError.extensions.code == "UNAUTHENTICATED") {
                this.showMessage = MESSAGE_UNAUTHENTICATED
            }

        })
    }


}
