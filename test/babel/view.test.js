import * as babel from "@babel/core";
import { plugin } from "../../babel/plugin";
import { view_unit_name } from "../../babel/view-transform";

function transform(code) {
  return babel.transform(code, {
    plugins: [ plugin ],
    code: true,
    ast: false,
  }).code;
}

test("should work unit inside func with JSX", () => {
  const code = `
  test(() => {
    const u_f = unit({
      constructor(...args) {
        constr(...args);
      },
      destructor() {
        destr();
      }
    });
    const el = mount(<A/>);
  })`;
  const expected = `test(() => {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  const u_f = unit(function () {
    let _core = unit.c;
    return [(...args) => {
      _core[9]();

      constr(...args);

      _core[10]();
    }, () => {
      destr();
    }, 0, 0];
  }, [], [], [], []);
  const el = mount(<A />);

  _c_unit_v[1]();
});`;
  expect(transform(code)).toBe(expected);
});

test("should transform nested functions JSX", () => {
  const code = `
    function _() {
      function A() {
        return <div />;
      }
    }
  `;
  const expected = `function _() {
  function A() {
    let _c_unit_v = ${view_unit_name},
        _c_ret_tmp;

    _c_unit_v[0]();

    return _c_ret_tmp = <div />, _c_unit_v[1](), _c_ret_tmp;
  }
}`;
  expect(transform(code)).toBe(expected);
});

test("should transform JSX functions with JSX functions", () => {
  const code = `
    function _() {
      function A() {
        function B() {
          return <div />;
        }
        return <div />;
      }
    }
  `;
  const expected = `function _() {
  function A() {
    let _c_unit_v2 = ${view_unit_name},
        _c_ret_tmp2;

    _c_unit_v2[0]();

    function B() {
      let _c_unit_v = ${view_unit_name},
          _c_ret_tmp;

      _c_unit_v[0]();

      return _c_ret_tmp = <div />, _c_unit_v[1](), _c_ret_tmp;
    }

    return _c_ret_tmp2 = <div />, _c_unit_v2[1](), _c_ret_tmp2;
  }
}`;
  expect(transform(code)).toBe(expected);
});

test("should transform expression functions JSX", () => {
  const code = `
    export const App = function() {
      useService(Unit);
      return null;
    }
    export const H1 = function() {
      return <h1 />;
    }
  `;
  const expected = `export const App = function () {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  useService(Unit);
  return _c_ret_tmp = null, _c_unit_v[1](), _c_ret_tmp;
};
export const H1 = function () {
  let _c_unit_v2 = ${view_unit_name},
      _c_ret_tmp2;

  _c_unit_v2[0]();

  return _c_ret_tmp2 = <h1 />, _c_unit_v2[1](), _c_ret_tmp2;
};`;
  expect(transform(code)).toBe(expected);
});

test("should transform arrow functions JSX", () => {
  const code = `
    export const App = () => {
      useService(Unit);
      return null
    }
    export const H1 = () => <h1 />;
    export const A = ({ p }) => {
      if (p) return <p />;
      return <b />;
    };
  `;
  const expected = `export const App = () => {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  useService(Unit);
  return _c_ret_tmp = null, _c_unit_v[1](), _c_ret_tmp;
};
export const H1 = () => {
  let _c_unit_v2 = ${view_unit_name},
      _c_ret_tmp2;

  _c_unit_v2[0]();

  return _c_ret_tmp2 = <h1 />, _c_unit_v2[1](), _c_ret_tmp2;
};
export const A = ({
  p
}) => {
  let _c_unit_v3 = ${view_unit_name},
      _c_ret_tmp3;

  _c_unit_v3[0]();

  if (p) return _c_ret_tmp3 = <p />, _c_unit_v3[1](), _c_ret_tmp3;
  return _c_ret_tmp3 = <b />, _c_unit_v3[1](), _c_ret_tmp3;
};`;
  expect(transform(code)).toBe(expected);
});

test("should transform JSX manipulations", () => {
  const code = `function Whirl({ children }) {
    const { map, shift, push } = useUnit(whirl);
    return (
      <>
        <button onClick={shift}>-</button>
        {map(key => (
          <Scope key={key}>
            {children}
          </Scope>
        ))}
        <button onClick={push}>+</button>
      </>
    )
  }`;
  const expected = `function Whirl({
  children
}) {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  const {
    map,
    shift,
    push
  } = useUnit(whirl);
  return _c_ret_tmp = <>
        <button onClick={shift}>-</button>
        {map(key => {
      let _c_unit_v2 = ${view_unit_name},
          _c_ret_tmp2;

      _c_unit_v2[0]();

      return _c_ret_tmp2 = <Scope key={key}>
            {children}
          </Scope>, _c_unit_v2[1](), _c_ret_tmp2;
    })}
        <button onClick={push}>+</button>
      </>, _c_unit_v[1](), _c_ret_tmp;
}`;
  expect(transform(code)).toBe(expected);
});


