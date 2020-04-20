export default async function(urls) {
  let values = [];
  let promises = urls.map(async (obj) => { 
    let res = await this.fetch(obj.u);
    let json = await res.json();
    values[obj.v] = json;
  });

  await Promise.all(promises);

  return values;
}
