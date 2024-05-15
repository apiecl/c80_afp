<!DOCTYPE html>
<html>

<head>
    <?php wp_head(); ?>
</head>

<body <?php body_class('afp-app-body'); ?>>

    <?php include(plugin_dir_path(__FILE__) . 'navigation.php'); ?>

    <div class="c80_afp-menu-wrapper">
        <ul class="c80_afp-menu">
            <!--js generated menu-->
        </ul>
    </div>

    <main class="app-container" id="c80_afp-pensiones">
        <?php
        if (have_posts()) :
            while (have_posts()) : the_post();
                // Display post content
        ?>

                <div class="c80_afp-content">
                    <?php the_content(); ?>
                </div>
        <?php
            endwhile;
        endif;
        ?>
    </main>
    <?php wp_footer(); ?>
</body>

</html>