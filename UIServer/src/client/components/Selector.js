import React from "react";

export default function Selector(props) {
  return (
    <div id="row">
      <select
        className="form-select form-select-sm"
        aria-label="Default select-sm example"
        id={props.propsIdName}
      >
        <option defaultValue>All</option>
        <option value="1">Node 1</option>
        <option value="2">Node 2</option>
        <option value="3">Node 3</option>
        <option value="4">Node 4</option>
        <option value="5">Node 5</option>
      </select>

      <button
        type="button"
        className="btn btn-dark btn-sm "
        id="button"
        onClick={() => props.propsFunction()}
      >
        {props.propsButtonName}
      </button>
    </div>
  );
}
