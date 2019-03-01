const OnChange = (event, userNotify) => {
  const target = event.target;
  const value = target.type === "checkbox" ? target.checked : target.value;
  const name = target.name;
  var lsSource = [name][0];
  //clear any previously set errors on resume typing
  let clEr = Object.assign({}, userNotify);
  clEr[name] = "";
  const returnObj = {
    userNotify: clEr,
    lsSource: lsSource,
    rebuildFormData: {
      name: name,
      value: value,
      lsSource: lsSource
    }
  };
  return returnObj;
};

export default OnChange;
