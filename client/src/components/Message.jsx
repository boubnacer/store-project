function Message({ variant, children }) {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800 ml-[2rem]";
    }
  };
  return (
    <div className={`p-4 rounded text-center ${getVariantClass()}`}>
      {children}
    </div>
  );
}

export default Message;
