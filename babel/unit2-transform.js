const
  { types, template, traverse } = require("@babel/core");

const
  f_name = "unit2";

module.exports = {
  unit2_transform
};

function unit2_transform(path, _state) {

  const config = path.node.arguments[0];
  if (config) {
    let values = new Array();
    let comps = new Array();
    let expr = 0;
    let constr = 0;
    let destr = 0;
    let methods = new Array();
    let literals = {};

    let text = [];
    let text_return_section = [];

    for (let prop of config.properties) {

      if (types.isObjectProperty(prop)) {
        let name = prop.key.name;
        let value = prop.value;
        values.push([name, value]);
        continue;
      }

      if (types.isObjectMethod(prop)) {
        if (prop.kind === "get") {
          let name = prop.key.name;
          let body = prop.body;

          let c_cache_name = path.scope.generateUid("c_cache");
          let tpl = template(`
            return ${c_cache_name} = EXPR, ${f_name}.b8/*box_computed_finish*/(), ${c_cache_name};
          `)

          let return_paths = [];
          traverse(prop, {
            ReturnStatement(path) {
              return_paths.push(path);
            }
          }, path.scope, path);

          for (let path of return_paths) {
            path.replaceWith(
              tpl({
                EXPR: path.node.argument
              })
            );
          }

          comps.push([name, body, c_cache_name, return_paths.length]);
          continue;
        }
        if (prop.method) {
          let name = prop.key.name;
          let body = prop.body;
          if (name === "expression") {
            expr = [name, body];
            continue;
          }
          if (name === "constructor") {
            constr = [name, body, prop.params];
            continue;
          }
          if (name === "destructor") {
            destr = [name, body, prop.params];
            continue;
          }

          methods.push([
            name,
            body,
            prop.params,
            prop.async,
            prop.generator
          ]);
        }
      }
    }

    text.push(`function FN_NAME(){`);
    literals.FN_NAME = "";

    if (constr) {
      let [ name, body, params ] = constr;

      function text_params() {
        if (!params || !params.length) return '';
        literals.CONSTRUCTOR_PARAMS = params;
        return "CONSTRUCTOR_PARAMS";
      }

      text_return_section.push(`(${text_params()}) => {
        ${f_name}.b9/*box_entry_start*/();
        CONSTRUCTOR_BODY
        ${f_name}.ba/*box_entry_finish*/();
      }`);
      literals.CONSTRUCTOR_BODY = body.body;
    }
    else {
      text_return_section.push("0");
    }

    if (destr) {
      text_return_section.push(`() => {
        DESTRUCTOR_BODY
      }`);
      literals.DESTRUCTOR_BODY = body.body;
    }
    else {
      text_return_section.push("0");
    }

    if (expr) {
      let e_id_name = path.scope.generateUid("e_id");
      let e_fn_name = path.scope.generateUid("e_fn");

      text.push(`
        let ${e_id_name} = ${f_name}.b3/*box_expr_create*/();
        let ${e_fn_name} = () => {
          ${f_name}.b4/*box_expr_start*/(${e_id_name});
          EXPR_BODY
          ${f_name}.b5/*box_expr_finish*/();
        };
        ${f_name}.fns.set(${e_id_name}, ${e_fn_name});
      `);

      literals.EXPR_BODY = expr[1].body;
      text_return_section.push(`${e_fn_name}`);
    }
    else {
      text_return_section.push("0");
    }

    let values_uniq_seq = 0;
    for (let [name, value] of values) {
      const placeholder = `VALUE_${name.toUpperCase()}_${++values_uniq_seq}`;
      text_return_section.push(placeholder);
      literals[placeholder] = value;
    }

    let comps_uniq_seq = 0;
    for(let comp of comps) {
      let [ name, body, c_cache_name, has_return ] = comp;
      let c_id_name = path.scope.generateUid("c_id");
      const body_ph = `COMPUTED_BODY_${name.toUpperCase()}_${++comps_uniq_seq}`;
      text.push(`
        let ${c_cache_name}, ${c_id_name} = ${f_name}.b6/*box_computed_create*/();
      `);
      let finish_text = `${f_name}.b8/*box_computed_finish*/()`;
      text_return_section.push(`
      () => { /* ${comp[0]} */
        if (${f_name}.b7/*box_computed_start*/(${c_id_name})) return ${c_cache_name};
        ${body_ph}
        ${!has_return ? finish_text : ""}
      }
      `);
      literals[body_ph] = body.body;
    }

    let methods_uniq_seq = 0;
    for (let method of methods) {
      let [ name, body, params, _async, _generator ] = method;
      const params_ph = `PARAMS_${name.toUpperCase()}_${++methods_uniq_seq}`;
      const body_ph = `METHOD_BODY_${name.toUpperCase()}_${++methods_uniq_seq}`;

      function text_params() {
        if (!params || !params.length) return '';
        literals[params_ph] = params;
        return params_ph;
      }

      function text_async() {
        if (!_async) return "";
        return "async ";
      }

      text_return_section.push(`${text_async()}(${text_params()}) => {
        ${body_ph}
      }`);
      literals[body_ph] = body.body;
    }


    text.push(`
    return [
      ${text_return_section.join(",")}
    ];`);

    text.push(`}`);
    let fn_code = text.join("\n");

    let p1_code = `[
      ${values.map(([name]) => `"${name}"`).join(",")}
    ]`;
    let p2_code = `[
      ${comps.map(([name]) => `"${name}"`).join(",")}
    ]`;
    let p3_code = `[
      ${methods.map(([name]) => `"${name}"`).join(",")}
    ]`;

    let fn_compiled = template(fn_code)(literals);
    let p1_compiled = template(p1_code)({});
    let p2_compiled = template(p2_code)({});
    let p3_compiled = template(p3_code)({});

    path.node.arguments = [
      fn_compiled,
      p1_compiled.expression,
      p2_compiled.expression,
      p3_compiled.expression
    ];
  }
}
