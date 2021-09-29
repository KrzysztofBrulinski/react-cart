import React from "react";

const Button = ({
  slot = "",
  cssClass = "",
  isDisabled = false,
  handleClick,
}) => {
  return (
    <button disabled={isDisabled} className={cssClass} onClick={handleClick}>
      {slot}
    </button>
  );
};

export default Button;
