export function setRepo(repoProd: any, repoTest: any, host: string) {
  console.log('Host:', host);
  if (host.includes('localhost') || host.includes('amecwebtest')) {
    console.log('Using test repository');
    return repoTest;
  } else {
    console.log('Using production repository');
    return repoProd;
  }
}
