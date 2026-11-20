if (new URL(location.href).searchParams.get('view') === '3d') {
  location.replace(new URL('3d/' + location.hash, location.href));
}
