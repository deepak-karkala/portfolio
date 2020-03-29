/**
 * LjSlider v1.2
 * Licensed under the terms of the MIT license.
 * 
 * By Marson Lj @idjitjohn
 * https://idjitjohn.github.io/portfolio
 */
function LjSlider(data) {
    this.init(data);
}

LjSlider.prototype.initParams = function(data){
    var params = {
        elt: null,
        sameStep: true,
        start: 0,
        pins: 1,
        handler: console.log,
        link: true,
        steps: [{ step: 1, number: 10 }],
        values: []
    };
    //Adding data
    for (key in params){
        this[key] = (typeof data[key] == 'undefined') ? params[key]:data[key];
    }
}

LjSlider.prototype.getValues = function(){
    return this.values;
}

LjSlider.prototype.setValues = function(values){
    if(!Array.isArray(values)) return this.setValues([values]);
    var a_all = Array.from(this.elt.querySelectorAll(".pin"));
    for (let i = 0; i < values.length && a_all[i]; i++) {
        var l = this.steps_values.values.indexOf(values[i]);
        if(l>=0){
            a_all[i].style.left = this.steps_values.steps[l]+'%';
            a_all[i].dataset.val = values[i];
            LjSlider.current = this;
            this.change();
            LjSlider.current = undefined;
        }
    }
}

LjSlider.prototype.init = function(data){
    this.initParams(data);
    if(!this.checkErrors()) return;
    this.createPins();
    this.createLinks();
    this.addEvents();

    //read initial values
    var vals = this.values;
    if(!Array.isArray(vals) || vals.length>0)this.setValues(vals);
    else{
        vals = this.elt.dataset.val;
        if(vals){
            this.setValues(JSON.parse('['+this.elt.dataset.val+']'));
            this.elt.removeAttribute('data-val');
        }
        else{
            for (let i = 0; i < this.pins; i++) this.values.push(this.start);
        }
    }
}

LjSlider.prototype.change = function() {
    var a_all = Array.from(LjSlider.current.elt.querySelectorAll(".pin"));
    a_all = a_all.map(function(pin) {
        return {
            pin: pin,
            val: pin.dataset.val
                ? parseFloat(pin.dataset.val)
                : LjSlider.current.start,
            x: pin.style.left ? parseFloat(pin.style.left) : 0
        };
    }).sort(function(a, b) {
        return a.val < b.val ? -1 : 1;
    });
    LjSlider.current.values = a_all.map(function(v) {
        return v.val;
    });

    if (LjSlider.current.link){
        var rest = LjSlider.current.pins % 2;
        if(rest){
            var link = LjSlider.current.elt.querySelector(".diff");
            link.style.left ="0";
            link.style.width = a_all[0].x + "%";
        }
        for (let i = rest; i < Math.ceil(LjSlider.current.pins / 2); i++) {
            var link = LjSlider.current.elt.querySelectorAll(".diff")[i + rest];
            link.style.left = a_all[i * 2 + rest].x + "%";
            link.style.width = a_all[i * 2 + 1 + rest].x - a_all[i * 2 + rest].x + "%";
        }
    }

    LjSlider.current.handler(
        a_all.map(function(v) {
            return v.val;
        })
    );
}

LjSlider.prototype.checkErrors = function(){
    if (!this.elt.classList) {
        return console.error(
            "The passed elt parameter must be a DOMElemnt"
        );
    }
    else this.elt.classList.add('lj-slider')
    if (this.pins <= 0) {
        return console.error("The passed `pins` value is not valid ");
    }
    return true;
}

LjSlider.prototype.createPins = function(){
    for (let i = 0; i < this.pins; i++) {
        var d = document.createElement("div");
        d.classList.add("pin");
        this.elt.appendChild(d);
    }
}

LjSlider.prototype.createLinks = function(){
    if (this.link)
    for (let i = 0; i < Math.ceil(this.pins / 2); i++) {
        var d = document.createElement("div");
        d.classList.add("diff");
        this.elt.appendChild(d);
    }
}

LjSlider.prototype.getMinStep = function(){
    return this.steps.reduce(function(prev, step) {
        return step.step < prev ? step.step : prev;
    }, this.steps[0].step);
}

/** 
 * Computing all possible steps
 * return all steps in percentage in an array
*/
LjSlider.prototype.initSteps = function(){
    var minstep = this.getMinStep();

    this.steps = this.steps.map(function(step) {
        step["multiply"] = this.sameStep ? 1 : step.step / minstep;
        return step;
    });

    //Taking all steps in percentage
    var onestep =
        100 /
        this.steps.reduce(function(prev, step) {
            return prev + step.number * step.multiply;
        }, 0);
    var steps = [0];
    var values = [this.start];
    this.steps.reduce(
        function(prev, step) {
            var v = prev[1];
            prev = prev[0];
            for (let i = 1; i <= step.number; i++) {
                steps.push(prev + onestep * step.multiply * i);
                values.push(v + step.step * i);
            }
            prev = prev + onestep * step.multiply * step.number;
            v = v + step.step * step.number;
            return [prev, v];
        },
        [0, this.start]
    );
    this.steps_values = {steps:steps,values:values};
}

//Adding enents to pins
LjSlider.prototype.addEvents = function(){
    this.initSteps();
    var that = this;

    var f_win_handler = function(e) {
        if (!LjSlider.current_pin || e.y === 0) return;
        var values = LjSlider.current.steps_values.values;
            steps = LjSlider.current.steps_values.steps;
        //Variables - getting and Computing
        var val = LjSlider.current.start, pin = LjSlider.current_pin;
            par = parseInt(getComputedStyle(pin.parentNode).width);
        var left = 0, pin_parent = pin.parentNode;
        while(pin_parent){
            left += pin_parent.offsetLeft;
            pin_parent = pin_parent.offsetParent;
        }
        var x = (e.touches ? e.touches[0].clientX : e.clientX) - left ;

        //if x is out of bounds
        if (x > par) x = par;
        else if (x < 0) x = 0;

        //Respect steps - simulate jumping
        x = (x * 100) / par;
        for (var i = 0; i < steps.length; i++) {
            if (steps[i + 1] >= x) {
                if (steps[i] < x) {
                    if (
                        Math.abs(x - steps[i]) < Math.abs(x - steps[i + 1])
                    ) {
                        x = steps[i];
                        val = values[i];
                    } else {
                        x = steps[i + 1];
                        val = values[i + 1];
                    }
                }
                break;
            }
        }
        //moving!
        if (parseFloat(pin.dataset.val) != val) {
            pin.style.left = x + "%";
            pin.dataset.val = val;
            that.change();
        }
    }
    if( typeof LjSlider.window_handled == 'undefined' ) {
        LjSlider.window_handled = true;
        var deactivate = function() {
            LjSlider.current_pin = undefined;
            LjSlider.current = undefined;
        }
        window.addEventListener("mousemove", f_win_handler, false);
        window.addEventListener("touchmove", f_win_handler, false);
        window.addEventListener("mouseup",deactivate,false);
        window.addEventListener("touchend",deactivate,false);
    }
    var activate = function(e) {
        LjSlider.current = that;
        LjSlider.current_pin = e.target;
    }
    this.elt.querySelectorAll(".pin").forEach(function(pin) {
        pin.addEventListener("mousedown",activate,false);
        pin.addEventListener("touchstart",activate,false);
    });
}