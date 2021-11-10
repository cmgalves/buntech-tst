import { FormControl } from "@angular/forms";

export class FormValidations {
    static cpfValidator(control: FormControl){
        const cpf = control.value;
        if (cpf && cpf != " "){
            
        }
        
        return null;
    }
}