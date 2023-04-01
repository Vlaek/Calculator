const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "0";
let operators = ["+", "-", "*", "/"];

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if (value == "clear") {
            clearAll();
        } else if (value == "backspace") {
            pushBackspace();
        } else if (value == "=") {
            equate();
        } else if (value == "brackets") {
            pushBrackets();
        } else {
            pushNumber(value);
        }
    })
}

document.addEventListener('keydown', function(event) {
    let key = event.key;
    let availableKeys = ['Escape', 'Backspace', 'Enter', '(', ')', '=', '+', '-', '/', '*', '%',
                         '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']

    if (availableKeys.includes(key)) {
        if (key == 'Escape') {
            clearAll();
        } else if (key == 'Backspace') {
            pushBackspace();
        } else if (key == '=' || key == 'Enter') {
            equate();
        } else if (key == '(' || key == ')') {
            pushBrackets();
        } else if (key >= '0' && key <= '9' || 
        key == '+' || key == '-' || key == '/' || key == '*' || key == '%' || key == '.') {
            pushNumber(key);
        }

        if (key == '+')
            key = 'Plus'
        else if (key == '-')
            key = 'Minus'
        else if (key == '*')
            key = 'Multiply'
        else if (key == '/')
            key = 'Divide'
        else if (key == '=')
            key = 'Equals'
        else if (key == '%')
            key = 'Percent'
        else if (key == '(' || key == ')')
            key = 'Brackets'
        else if (key == '.')
            key = 'Period'
        
        document.getElementById("btn" + key).classList.add('active');
        setTimeout(function(){
            document.getElementById('btn' + key).classList.remove('active');
        }, 200)
    }
    
});

function clearAll() {
    input = "0";
    display_input.innerHTML = "";
    display_output.innerHTML = "0";
}

function equate() {
    let result = evaluateExpression(prepareInput(input));

    if (!Number.isInteger(result)) {
        result = round(result, 15);
    }

    input = "" + result;
    display_input.innerHTML = "";
    display_output.innerHTML = result;

    if (!isFinite(result)) {
        display_output.innerHTML = "Error";
        display_input.innerHTML = "";
        input = "0";
    }
}

function pushBackspace() {
    if (display_input.innerHTML == "") {
        if (display_output.innerHTML == "0") {
            return false;
        }
        display_output.innerHTML = display_output.innerHTML.slice(0, -1);
    } else {
        input = input.slice(0, -1);
    
        display_input.innerHTML = cleanInput(input);
    }
}

function pushBrackets() {

    if (
        input.indexOf("(") == -1 || 
        input.indexOf("(") != -1 && 
        input.indexOf(")") != -1 && 
        input.lastIndexOf("(") < input.lastIndexOf(")")
    ) {
        if (input == 0 && input.length == 1) {
            input = "(";
        } else {
            let char = input[input.length - 1];
            if (char >= 0 && char <= 9 || char == ')') {
                input += "*(";
            } else {
                input += "(";
            }  
        }
        
    } else if (
        input.indexOf("(") != -1 && 
        input.indexOf(")") == -1 ||
        input.indexOf("(") != -1 &&
        input.indexOf(")") != -1 &&
        input.lastIndexOf("(") > input.lastIndexOf(")")
    ) {
        if (input[input.lastIndexOf("(") + 1] == undefined) {
            input += "0)"; 
        } else {
            if (operators.includes(input[input.length - 1]))
                input = input.slice(0, -1);
            input += ")";
        }
    }

    display_input.innerHTML = cleanInput(input); 
}

function pushNumber(value) {
    if (validateInput(value)) {
        if (input == 0 && input.length == 1 || display_input.innerHTML == "" && value >= 0 && value <= 9) {
            input = value
        } else {
            input += value;
        }
        if (input.length == 1 && 
            input[0] == "/" || input[0] == "*" || input[0] == "-" || input[0] == "+"
             || input[0] == "." || input[0] == '%')
            input = "0" + input;

        display_input.innerHTML = cleanInput(input); 
    }      
}

function cleanInput(input) {
    let input_array = input.split("");
    let input_array_length = input_array.length;

    for (let i = 0; i < input_array_length; i++) {
        if (input_array[i] == "*") {
            input_array[i] = ` <span class="operator">x</span> `;
        } else if (input_array[i] == "/") {
            input_array[i] = ` <span class="operator">/</span> `;
        } else if (input_array[i] == "+") {
            input_array[i] = ` <span class="operator">+</span> `;
        } else if (input_array[i] == "-") {
            input_array[i] = ` <span class="operator">-</span> `;
        } else if (input_array[i] == "(") {
            input_array[i] = `<span class="brackets">(</span>`;
        } else if (input_array[i] == ")") {
            input_array[i] = `<span class="brackets">)</span>`;
        } else if (input_array[i] == "%") {
            input_array[i] = `<span class="percent">%</span>`;
        }
    }

    return input_array.join("");
}

function validateInput(value) {
    if (input.length != undefined) {
        let last_char = input.slice(-1);
        
        if (value == '.') {
            let list_input = input.split(/\+|\-|\*|\/|\%/);
            if (list_input.length > 0) {
                let last_input = list_input[list_input.length - 1];
                let last_input_chars = last_input.split("");
                if (value == '.' && last_input_chars.includes('.') || last_char == ')' || last_char == '(' || last_char == '%')
                    return false
            }
        }
    
        if (operators.includes(value) && operators.includes(last_char)) {
            if (last_char == value) {
                return false;
            } else {
                input = input.substring(0, input.length - 1);
                return true;
            }
        } else if (operators.includes(value) && last_char == '.') {
            input = input.slice(0, -1);
        } else if (operators.includes(last_char) && value == '.') {
            input += "0";
        } else if (operators.includes(last_char) && value == '%') {
            return false;
        } else if (operators.includes(value) && last_char == '(') {
            return false;
        }
    
        return true;
    }
    
    return false;
}

function prepareInput(input) {
    if (operators.includes(input[input.length - 1])) {
        input = input.slice(0, -1);
    }

    let input_array = input.split("");

    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] == "%") {
            input_array[i] = "/100";
        }
    }

    return input_array.join("");
}

function evaluateExpression(expression) {
    var func = new Function("return " + expression);
    return func();
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}