function Button({ type, className, dispatchHandler, text }) {
  return (
    <button type={type} className={className} onClick={() => dispatchHandler()}>
      {text}
    </button>
  );
}

export default Button;
