function Looper() {
  timeCheck();
  if (already_started) {
  setTimeout(Looper(), 1000)
  }
}

