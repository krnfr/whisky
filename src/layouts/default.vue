<script setup lang="ts">
</script>

<template>
  <n-layout position="absolute">
    <n-layout-header inverted id="header">
      <n-grid cols="2">
        <n-gi>
          <n-space :size="0" justify="start" align="center">
            <n-h2>
              <n-text class="title">whalter's whisky's</n-text>
            </n-h2>
          </n-space>
        </n-gi>
        <n-gi>
          <n-space justify="end" align="center">
            <!-- <n-button text>
              <n-icon>
                <carbon-refresh />
              </n-icon>
            </n-button>-->
          </n-space>
        </n-gi>
      </n-grid>
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
  $padding-y: 20px;
  height: $header;
  padding-top: 5px;
  padding-left: $padding-y;
  padding-right: $padding-y;
  // padding: 20px;
}

.title {
  align-self: center;
  justify-content: center;
  align-items: center;
  color: #fff;
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
