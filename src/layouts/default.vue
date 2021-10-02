<template>
  <n-layout position="absolute">
    <n-layout-header inverted id="header">
      <span>walter's whisky's</span>
    </n-layout-header>
    <n-layout-content position="absolute" id="content">
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-layout-content>
    <n-layout-footer bordered position="absolute" id="footer">
      <Footer />
    </n-layout-footer>
  </n-layout>
</template>

<style lang="scss">
$header: 48px;
$footer: 45px;

#header {
  height: $header;
  // padding: 20px;
}

#content {
  top: $header;
  bottom: $footer;
  padding: 5px;
}

#footer {
  height: $footer;
}
</style>
