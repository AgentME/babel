import * as t from "babel-types";

function getName(key) {
  if (t.isIdentifier(key)) {
    return key.name;
  }
  return key.value.toString();
}

export default function() {
  return {
    visitor: {
      ObjectExpression(path) {
        const { node } = path;
        const plainProps = node
          .properties
          .filter(prop => !t.isSpreadProperty(prop) && !prop.computed);

        const alreadySeenNames = {};

        plainProps
          .filter(prop => {
            const name = getName(prop.key);
            if (Object.prototype.hasOwnProperty.call(alreadySeenNames, name)) {
              return true;
            } else {
              alreadySeenNames[name] = true;
              return false;
            }
          })
          .forEach(prop => {
            prop.computed = true;
            prop.key = t.stringLiteral(getName(prop.key));
          });
      }
    }
  };
}
