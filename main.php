<?php
/*
Plugin Name: C80 AFP Pensiones
Plugin URI: https://apie.cl
Version: 0.0.1
Author: Pablo Selín
Author URI: https://apie.cl
*/

include_once(plugin_dir_path(__FILE__) . 'lib/PageTemplater.php');

function c80afp_enqueue()
{
    global $post;
    if (get_post_meta($post->ID, '_wp_page_template', true) == 'c80_afp-pensiones.php') {
        wp_enqueue_script('timelinejs', get_bloginfo('template_url') . '/dist/c80-timeline-bundle.js', array('zingtouch', 'c80js'), '3.6.6?mod=c80', false);
        wp_enqueue_script('zingtouch', 'https://cdnjs.cloudflare.com/ajax/libs/zingtouch/1.0.6/zingtouch.min.js#asyncload', array(), '1.0.6', false);
        wp_enqueue_style('timelinecss', 'https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css', array(), false, 'screen');
        wp_enqueue_style('c80_afp', plugin_dir_url(__FILE__) . '/dist/css/c80_afp.css', ['wp-block-library'], time());
        wp_dequeue_style('c80-style');
        wp_enqueue_script('echarts', plugin_dir_url(__FILE__) . '/assets/js/echarts.js', [], '5.4.3');
        wp_enqueue_script('timeline', plugin_dir_url(__FILE__) . '/assets/js/afp-timeline.js', ['jquery', 'timelinejs'], time());
        wp_enqueue_script('afpcharts', plugin_dir_url(__FILE__) . '/assets/js/afpcharts.js', ['echarts'], time(), true);
        wp_enqueue_script('fontawesome', 'https://use.fontawesome.com/269614ad84.js#asyncload', array(), '4.7.0', true);
        wp_localize_script('afpcharts', 'afpc80data', [
            'inversiones'       => json_decode(file_get_contents(plugin_dir_path(__FILE__) . '/assets/data/grafico_inversiones.json')),
            'inversiones_alt'   => json_decode(file_get_contents(plugin_dir_path(__FILE__) . '/assets/data/grafico_inversiones_alt.json')),
            'directores'        => json_decode(file_get_contents(plugin_dir_path(__FILE__) . '/assets/data/grafico_directores.json')),
            'pensiones_pagadas' => json_decode(file_get_contents(plugin_dir_path(__FILE__) . '/assets/data/grafico_pensiones_pagadas.json')),
            'comparativo'       => json_decode(file_get_contents(plugin_dir_path(__FILE__) . '/assets/data/grafico_comparativo_tipo_pension.json')),
            'resumen'           => json_decode(file_get_contents(plugin_dir_path(__FILE__) . '/assets/data/grafico_comparativo_resumen.json'))
        ]);
    }
}

add_action('wp_enqueue_scripts', 'c80afp_enqueue', 10);

function c80afp_chart_shortcode($atts)
{
    $atts = shortcode_atts(array(
        'grafico' => null,
        'titulo' => null
    ), $atts);

    $grafico = $atts['grafico'];
    $titulo = $atts['titulo'];

    $contents = '<div class="c80_chart" data-grafico="' . $grafico . '" data-title="' . $titulo . '"><!--Echarts container--></div>';

    return $contents;
}

add_shortcode('c80_grafico', 'c80afp_chart_shortcode');

function c80afp_diagram_shortcode($atts)
{
    $atts = shortcode_atts(array(
        'diagrama' => null
    ), $atts);

    $diagrama = $atts['diagrama'];
    $contents = '<div class="c80_diagram" data-diagram="' . $diagrama . '"><!--Diagram container--></div>';

    return $contents;
}

add_shortcode('c80_diagrama', 'c80afp_diagram_shortcode');

function c80afp_timeline($atts)
{
    return '<div id="afp_timeline" class="afp-timeline-wrapper"><div id="afp-timeline-js-container" class="afp-timeline"><!-- Timeline --></div></div>';
}

add_shortcode('c80_timeline_afp', 'c80afp_timeline');
