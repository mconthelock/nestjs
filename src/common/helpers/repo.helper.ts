export function setRepo(repoProd: any, repoTest: any, host: string) {
  console.log('Host:', host);
  if (checkHostTest(host)) {
    console.log('Using test repository');
    return repoTest;
  } else {
    console.log('Using production repository');
    return repoProd;
  }
}

export function checkHostTest(STATE: string) {
  return STATE.includes('development');
}
