class Usos {
  asPOJO = (obj) => JSON.parse(JSON.stringify(obj));
  renameField = (record, from, to) => {
    record[to] = record[from];
    delete record[from];
    return record;
  };
  removeField = (record, field) => {
    const value = record[field];
    delete record[field];
    return value;
  };
}
export default Usos;
