<?php
    //
    // Define constants
    define("THEME_DIR", get_template_directory_uri());
    define("THEME_ROOT", get_template_directory());


    //
    // Updates
    add_filter("auto_update_theme", "__return_true");


    //
    // Disable XML-RPC - https://www.scottbrownconsulting.com/2020/03/two-ways-to-fully-disable-wordpress-xml-rpc/
    function remove_xmlrpc_methods($methods) {
        return array();
    }
    add_filter("xmlrpc_methods", "remove_xmlrpc_methods");


    //
    // https://www.dev4press.com/blog/wordpress/2015/canonical-redirect-problem-and-solutions/
    function disable_canonical_redirects() {
        remove_action("template_redirect", "redirect_canonical");
    }
    add_action("after_setup_theme", "disable_canonical_redirects");


    //
    //
    function clean_wp_head() {
        remove_action("wp_head", "wp_generator");
        remove_action("wp_head", "rsd_link");
        remove_action("wp_head", "wlwmanifest_link");

        global $sitepress;
        remove_action("wp_head", array($sitepress, "meta_generator_tag", 20));
    }
    add_action("after_setup_theme", "clean_wp_head");;


    //
    //
    function add_theme_features() {
        add_theme_support("post-thumbnails");
        add_theme_support("automatic-feed-links");
        add_theme_support("html5", array("comment-form", "comment-list", "gallery", "caption"));
        add_theme_support("title-tag");
    }
    add_action("after_setup_theme", "add_theme_features");


    //
    // Add extra MIME types
    function extra_mime_types($mimes) {
        $mimes["svg"] = "image/svg";
        $mimes["webp"] = "image/webp";

        return $mimes;
    }
    add_filter("upload_mimes", "extra_mime_types");


    //
    // Remove default image sizes
    function remove_image_sizes() {
        remove_image_size("1536x1536");
    }
    add_action("init", "remove_image_sizes");


    //
    // Add extra image sizes
    function add_image_sizes() {
        add_image_size("small", 480, 480);
    }
    add_action("after_setup_theme", "add_image_sizes");


    //
    // Remove attributes from (get_)the_post_thumbnail output
    function remove_post_thumbnail_attr ($html) {
        return preg_replace("/(width|height|loading)=(\"|\')[A-Za-z0-9]+(\"|\')\s/", "", $html);
    }
    add_filter("post_thumbnail_html", "remove_post_thumbnail_attr");


    //
    // Remove links from admin bar
    function remove_admin_bar_links() {
        global $wp_admin_bar;

        $wp_admin_bar->remove_menu("wp-logo"); // WordPress logo & its sub-menu items
        $wp_admin_bar->remove_menu("comments"); // Comments
        $wp_admin_bar->remove_menu("new-user"); // New - user

        // $wp_admin_bar->remove_menu("wpseo-menu"); // Yoast SEO
    }
    add_action("wp_before_admin_bar_render", "remove_admin_bar_links", 999);


    //
    // Hide admin bar on the front end
    add_filter("show_admin_bar", "__return_false");


    //
    // Add ACF "Options" page
    function add_acf_options() {
        if (function_exists("acf_add_options_page")) {
            acf_add_options_page();
        }
    }
    add_action("after_setup_theme", "add_acf_options");


    //
    // Remove meta boxes
    function remove_meta_boxes() {
        remove_post_type_support("page", "page-attributes");
    }
    add_action("init", "remove_meta_boxes");


    //
    // Register custom navigation walker
    include "includes/walker-nav-menu-viktor-2020.php";


    //
    // Register menus
    function register_custom_nav_menus() {
        register_nav_menus(array(
            "site_header" => "Site header"
        ));
    }
    add_action("after_setup_theme", "register_custom_nav_menus");


    //
    // Deregister default scripts
    function remove_scripts() {
        if (!is_admin()) {
            wp_dequeue_script("jquery");
            wp_deregister_script("jquery");
        }
    }
    add_action("wp_enqueue_scripts", "remove_scripts");


    //
    // Register custom styles & scripts
    function add_styles_scripts() {
        $style_version = date("Ymd_His", filemtime(plugin_dir_path( __FILE__ ) . "/dist/css/style.css"));
        $bundle_version  = date("Ymd_His", filemtime(plugin_dir_path( __FILE__ ) . "/dist/js/bundle-main.js"));

        wp_enqueue_style("fonts", "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Recursive:wght@400;600&display=swap", false, null);
        wp_enqueue_style("style", THEME_DIR . "/dist/css/style.css", false, $style_version);
        wp_enqueue_script("bundle#defer", THEME_DIR . "/dist/js/bundle-main.js", false, $bundle_version);
    }
    add_action("wp_enqueue_scripts", "add_styles_scripts");


    //
    // Add async/defer attribute to custom scripts - https://stackoverflow.com/a/40553706, somewhat modified.
    if (!is_admin()) {
        function add_async_defer_attribute($tag, $handle) {
            if (
                strpos($handle, "async") ||
                strpos($handle, "defer")
            ) {
                if (strpos($handle, "async")) {
                    return str_replace("<script ", "<script async ", $tag);
                }
                if (strpos($handle, "defer")) {
                    return str_replace("<script ", "<script defer ", $tag);
                }
            } else {
                return $tag;
            }
        }
        add_filter("script_loader_tag", "add_async_defer_attribute", 10, 2);
    }
