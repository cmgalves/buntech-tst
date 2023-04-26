import { UntypedFormControl } from "@angular/forms";

export class FormValidations {
    static cpfValidator(control: UntypedFormControl){
        const cpf = control.value;
        if (cpf && cpf != " "){
            
        }
        
        return null;
    }
}