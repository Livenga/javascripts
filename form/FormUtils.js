var FormUtils = (function(w, d) {
  return function(form) {
    if(form.tagName !== 'FORM') throw 'invalid HTMLElement';
    this.form = form;
  }
}(window, document));

FormUtils.prototype.toObject = function() {
  var n = this.form.elements.length;
  var obj = {};

  var funAppend = function(obj, name, value) {
    if(Object.keys(obj).indexOf(name) >= 0) {
      if(Array.isArray(obj[name])) {
        obj[name].push(value);
      } else {
        var arr = new Array();
        arr.push(obj[name]);
        obj[name] = arr;
        obj[name].push(value);
      }
    } else {
      obj[name] = value;
    }
  };

  for(var i = 0; i < n; ++i) {
    var e = this.form.elements[i];

    if(e.name.length === 0) continue;

    if(e.tagName === 'TEXTAREA') {
      obj[e.name] = e.innerHTML;
    } else if(e.tagName === 'INPUT') {
      if(e.type === 'hidden'
        || e.type === 'text'
        || e.type === 'password') {
        funAppend(obj, e.name, e.value);
      } else if(e.type === 'number' || e.type === 'range') {
        funAppend(obj, e.name, e.value - 0);
      } else if(e.type === 'checkbox') {
        funAppend(obj, e.name, e.checked);
      } else if(e.type === 'radio' && e.checked) {
        funAppend(obj, e.name, e.value);
      }
    }
  }

  return obj;
}

FormUtils.prototype.toQuery = function() {
  var obj = this.toObject();

  return Object.keys(obj).map(function(value, idx, self) {
    if(Array.isArray(obj[value])) {
      return obj[value].map(function(value, idx, self) {
        return value + '[]=' + self[idx];
      }).join('&');
    } else {
      return value + '=' + (obj[value] + '');
    }
  }).join('&');
}

FormUtils.prototype._toQuery = function() {
  var n = this.form.elements.length;
  var query = '';

  for(var i = 0; i < n; ++i) {
    var e = this.form.elements[i];

    if(e.name.length === 0) continue;

    if(e.tagName === 'TEXTAREA') {
      query += e.name + '=' + e.innerHTML + '&';
    } else if(e.tagName === 'INPUT') {
      if(e.type === 'hidden'
        || e.type === 'text'
        || e.type === 'password'
        || e.type === 'number'
        || e.type === 'range') {
        query += e.name + '=' + e.value + '&';
      } else if(e.type === 'checkbox' && e.checked) {
        query += e.name + '=' + e.value + '&';
      } else if(e.type === 'radio' && e.checked) {
        query += e.name + '=' + e.value + '&';
      }
    } else { continue; }
    //console.log(e.name + '(' + e.name.length + ')' + ': ' + e.value);
  }

  return query.substring(0, query.length - 1);
}
