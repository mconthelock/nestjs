export function setRepo(repoProd: any, repoTest: any, host: string) {
  console.log('Host:', host);
  if (host.includes('localhost') || host.includes('amecwebtest')) {
    return repoTest;
  } else {
    return repoProd;
  }
}
