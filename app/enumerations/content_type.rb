class ContentType < EnumerateIt::Base
  associate_values(
    homepage: [3, 'Homepage'],
    map: [4, 'Map'],
    link: [5, 'Link'],
    static_content: [6, 'Static Content'],
    dashboard_v2: [7, 'Dashboard'],
    open_content_v2: [8, 'Open Content V2'],
    tag_searching: [9, 'Tag Searching'],
    group: [10, 'Group'],
    feedback: [11, 'Feedback']
  )
end
